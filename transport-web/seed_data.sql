
-- Insert Demo Stations
insert into stations (id, name) values
(1, 'Central Station'),
(2, 'North Terminal'),
(3, 'South Hub'),
(4, 'East Junction'),
(5, 'West Plaza')
on conflict (id) do nothing;

-- Insert Demo Routes
insert into routes (source, destination, weight) values
(1, 2, 5),
(1, 3, 7),
(1, 4, 3),
(1, 5, 4)
on conflict do nothing;

-- Insert Demo Vehicles
insert into vehicles (id, type) values
(101, 'bus'),
(102, 'metro'),
(103, 'tram')
on conflict (id) do nothing;
